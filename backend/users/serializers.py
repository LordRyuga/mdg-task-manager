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
        fields = ['class_id', 'name', 'created_at', 'user']

class AssignmentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignments
        fields = ['ass_id', 'name', 'class_id', 'users']        

class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = ['student', 'assignment', 'marks', 'submitted_url']        