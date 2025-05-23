from rest_framework import serializers
from .models import CustomUser, Classrooms, Assignments, Submission

class userRegisterationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['email', 'username', 'firstName', 'lastName', 'password', 'isStudent']

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            firstName=validated_data['firstName'],
            lastName=validated_data['lastName'],
            password=validated_data['password'],
            isStudent=validated_data['isStudent'] 
        )
        return user
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'firstName', 'lastName', 'isStudent']
         
class ClassroomsSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(many=True, read_only=True)

    class Meta:
        model = Classrooms
        fields = ['class_id', 'name', 'created_at', 'user', 'description']

class AssignmentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignments
        fields = ['ass_id', 'name', 'class_id', 'descriptionUrl', 'instructions', 'dueDate', 'total_Marks']        
        
    def create(self, validated_data):

        classroom = validated_data.get('class_id')
        assignment = Assignments.objects.create(**validated_data)
        users_in_class = classroom.users.all()

        assignment.users.set(users_in_class)

        return assignment

class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = ['user', 'assignment', 'marks', 'submitted_url']       

class SubmissionStatusSerializer(serializers.ModelSerializer):
    student_id = serializers.IntegerField(source='user.id', read_only=True)
    name = serializers.CharField(source='user.firstName', read_only=True)
    submitted = serializers.SerializerMethodField()

    class Meta:
        model = Submission
        fields = ['student_id', 'name', 'submitted', 'submitted_url', 'marks']

    def get_submitted(self, obj):
        return bool(obj.submitted_url)



class AssignmentCalendarSerializer(serializers.ModelSerializer):
    class_name = serializers.CharField(source='class_id.name', read_only=True)

    class Meta:
        model = Assignments
        fields = ['ass_id', 'name', 'dueDate', 'class_name']