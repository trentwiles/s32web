from dotenv import load_dotenv, find_dotenv
import os
import boto3
from botocore.config import Config

# Load .env
load_dotenv(find_dotenv())

# Fetch credentials
access_key = os.getenv("S3_ACCESS_KEY")
secret_key = os.getenv("S3_SECRET_KEY")
endpoint_url = os.getenv("S3_ENDPOINT_URL")
bucket_name = os.getenv("S3_BUCKET_NAME")

if not all([access_key, secret_key, endpoint_url, bucket_name]):
    raise Exception("Missing one or more required environment variables.")

# Initialize client and resource with same credentials
config = Config(signature_version='s3v4')

s3 = boto3.client(
    's3',
    aws_access_key_id=access_key,
    aws_secret_access_key=secret_key,
    endpoint_url=endpoint_url,
    config=config
)

def getItems(folder=""):
    folders = []
    files = []

    paginator = s3.get_paginator('list_objects_v2')
    page_iterator = paginator.paginate(
        Bucket=bucket_name,
        Prefix=folder,
        Delimiter="/"
    )

    for page in page_iterator:
        # Subfolders (CommonPrefixes)
        for prefix in page.get('CommonPrefixes', []):
            folder_name = prefix.get('Prefix')
            folders.append(folder_name)

        # Files (Contents)
        for obj in page.get('Contents', []):
            key = obj.get('Key')
            if key != folder:  # avoid listing the folder itself as a file
                files.append(key)

    return folders, files