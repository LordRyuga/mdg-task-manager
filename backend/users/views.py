from django.shortcuts import render
from rest_framework import status, views, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import userRegisterationSerializer
from .serializers import ClassroomsSerializer, AssignmentsSerializer
from .models import CustomUser, Classrooms, Assignments

class UserViewSet(viewsets.GenericViewSet):

    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['post'])
    def register(self, request):
        print(request.data)
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
    

class AssignmentViewSet(viewsets.GenericViewSet):

    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['post'])
    def submitAssignment(self, request):
        print(request.data)

        return Response(status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'])
    def createAssignment(self, request):
        user = request.user
        if user.isStudent:
            return Response({"error": "Only teachers can create assignments"}, status=status.HTTP_403_FORBIDDEN)
    
        print(request.data)
        classroom_id = request.data.get('class_id')
        print(classroom_id)
        serializer = AssignmentsSerializer(data=request.data)
        if serializer.is_valid():
            assignment = serializer.save()
            assignment.users.add(user)
            return Response(AssignmentsSerializer(assignment).data, status=status.HTTP_201_CREATED)
        
        print(serializer.errors)
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
        # print(user)
        # print(user.isStudent)
        if user.isStudent:
            return Response({"error": "Only teachers can create classrooms"}, status=status.HTTP_403_FORBIDDEN)
        
        classroom_name = request.data.get('classroom_name')
        # print(classroom_name)
        
        classroom = Classrooms.objects.create(name=classroom_name)
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
        print(classroom_id)
        if not classroom_id:
            return Response({"error": "class_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            classroom = Classrooms.objects.get(class_id=classroom_id)
        except Classrooms.DoesNotExist:
            return Response({"error": "Classroom not found"}, status=status.HTTP_404_NOT_FOUND)
        
        assignments = classroom.assignments.all()
        print(assignments)
        serializer = AssignmentsSerializer(assignments, many=True)
        print(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)
    


        
        
        

