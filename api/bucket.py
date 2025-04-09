import boto3
from botocore.config import Config
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize a session using Boto3
s3 = boto3.resource('s3')

# Select your bucket
s3_client = boto3.client(
    's3',
    aws_access_key_id=os.getenv("S3_ACCESS_KEY"),
    aws_secret_access_key=os.getenv("S3_SECRET_KEY"),
    endpoint_url=os.getenv("S3_ENDPOINT_URL"),
    config=Config(signature_version='s3')
)

buckets = s3_client.list_buckets()
for bucket in buckets['Buckets']:
    print(bucket['Name'])