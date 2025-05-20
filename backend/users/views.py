from django.shortcuts import render
from rest_framework import status, views, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import userRegisterationSerializer
from .serializers import ClassroomsSerializer, AssignmentsSerializer, SubmissionSerializer,SubmissionStatusSerializer, AssignmentCalendarSerializer
from .models import CustomUser, Classrooms, Assignments, Submission

class UserViewSet(viewsets.GenericViewSet):

    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['post'])
    def register(self, request):
        # print(request.data)
        serializer = userRegisterationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'], permission_classes = [permissions.IsAuthenticated])
    def get_user(self, request):
        user = request.user
        serializer = userRegisterationSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'], permission_classes = [permissions.IsAuthenticated])
    def get_user_assignments(self, request):
        user = request.user
        assignments = user.assignmentsUser.all()
        serializer = AssignmentCalendarSerializer(assignments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class AssignmentViewSet(viewsets.GenericViewSet):

    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def getAssignmentById(self, request):
        ass_id = request.query_params.get('ass_id')
        try:
            assignment = Assignments.objects.get(ass_id=ass_id)
        except Assignments.DoesNotExist:
            return Response({"error": "Assignment not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = AssignmentsSerializer(assignment)
        return Response(serializer.data, status = status.HTTP_200_OK)   
     
    
    @action(detail=False, methods=['post'])
    def submit(self, request):
         print(request.data)
         ass_id = request.data.get('ass_id')
         submitted_url = request.data.get('submitted_url')
         print(ass_id)

         try:
             assignment = Assignments.objects.get(ass_id=ass_id)
    
         except Assignments.DoesNotExist:
             return Response({"error": "Assignment not found"}, status=status.HTTP_404_NOT_FOUND)
         
         submission, created = Submission.objects.get_or_create(
         assignment=assignment,
         user=request.user,
         defaults={'submitted_url': submitted_url}
         )
         if not created:
             submission.submitted_url = submitted_url
             submission.save()
             serializer = SubmissionSerializer(submission)
             return Response(serializer.data, status=status.HTTP_200_OK)
         
         else:
             serializer = SubmissionSerializer(submission)
             return Response(serializer.data, status=status.HTTP_201_CREATED)

    
    @action(detail=False, methods=['get'])
    def submissionStatus(self, request):
        ass_id = request.query_params.get('ass_id')
        
        try:
            assignment = Assignments.objects.get(ass_id=ass_id)
        except:
            return Response({"error": "Assignment not found"}, status=status.HTTP_404_NOT_FOUND)    
        
        submissions = assignment.submissions.all()
        serializer = SubmissionStatusSerializer(submissions, many = True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
    @action(detail=False, methods=['get'])
    def submission(self, request):
        ass_id = request.query_params.get('ass_id')
        print(request.data)
        try:
            submission = Submission.objects.get(assignment__ass_id=ass_id, user=request.user)
            serializer = SubmissionSerializer(submission)
            return Response(serializer.data, status = status.HTTP_200_OK)
        except Submission.DoesNotExist:
            return Response({'error': 'Submission not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        
    @action(detail=False, methods=['post'])
    def submitMarks(self, request) :
        ass_id = request.data.get('ass_id')
        user = request.data.get('user')
        marks = request.data.get('marks')
        
        if not all([ass_id, user, marks]):
            return Response({'error': 'ass_id, user, and marks are required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            submission = Submission.objects.get(assignment__ass_id=ass_id, user=user)
            submission.marks = marks
            submission.save()
            serializer = SubmissionSerializer(submission)
            
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Submission.DoesNotExist:
            return Response({'error': 'submission for the student not found'}, status=status.HTTP_404_NOT_FOUND)
    


    @action(detail=False, methods=['post'])
    def createAssignment(self, request):
        user = request.user
        if user.isStudent:
            return Response({"error": "Only teachers can create assignments"}, status=status.HTTP_403_FORBIDDEN)
    
        # print(request.data)
        classroom_id = request.data.get('class_id')
        # print(classroom_id)
        serializer = AssignmentsSerializer(data=request.data)
        if serializer.is_valid():
            assignment = serializer.save()
            assignment.users.add(user)
            return Response(AssignmentsSerializer(assignment).data, status=status.HTTP_201_CREATED)
        
        # print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class ClassroomsViewSet(viewsets.GenericViewSet):
    
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def getAllClassrooms(self, request):
        user = request.user
        if user.isStudent:
            classrooms = user.classrooms.all()
        else:
            classrooms = user.classrooms.all()
        # print(classrooms)
        serializer = ClassroomsSerializer(classrooms, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'])
    def joinClassroom(self, request):
        user = request.user
        classroom_id = request.data.get('class_id')
        if not classroom_id:
            return Response({"error": "class_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            classroom = Classrooms.objects.get(class_id=classroom_id)
        except Classrooms.DoesNotExist:
            return Response({"error": "Classroom not found"}, status=status.HTTP_404_NOT_FOUND)
        
        classroom.users.add(user)
        classroom.save()

        return Response({"message": "Successfully joined the classroom"}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'])
    def createClassroom(self, request):
        user = request.user
        print(request)
        print(request.data)
        # print(user)
        # print(user.isStudent)
        if user.isStudent:
            return Response({"error": "Only teachers can create classrooms"}, status=status.HTTP_403_FORBIDDEN)
        
        classroom_name = request.data.get('classroom_name')
        # print(classroom_name)
        
        classroom = Classrooms.objects.create(name=classroom_name, description=request.data.get('description'))
        classroom.users.add(user)
        classroom.save()


        serializer = ClassroomsSerializer(classroom)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'])
    def getClassroom(self, request):
        user = request.user
        classroom_id = request.query_params.get('class_id')
        if not classroom_id:
            return Response({"error": "class_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            classroom = Classrooms.objects.get(class_id=classroom_id)
        except Classrooms.DoesNotExist:
            return Response({"error": "Classroom not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = ClassroomsSerializer(classroom)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'])
    def getAllAssignments(self, request):
        user = request.user
        classroom_id = int(request.query_params.get('class_id'))
        # print(classroom_id)
        if not classroom_id:
            return Response({"error": "class_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            classroom = Classrooms.objects.get(class_id=classroom_id)
        except Classrooms.DoesNotExist:
            return Response({"error": "Classroom not found"}, status=status.HTTP_404_NOT_FOUND)
        
        assignments = classroom.assignments.all()
        # print(assignments)
        serializer = AssignmentsSerializer(assignments, many=True)
        # print(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)
    


        
        
        

