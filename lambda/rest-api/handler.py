from datetime import datetime
import boto3
import os
import uuid
import json
import logging
import dynamo
import uuid

logger = logging.getLogger()
logger.setLevel(logging.INFO)
dynamodb = boto3.client('dynamodb')
table_name = str(os.environ['DYNAMODB_TABLE'])

def get(event, context):
    print("::::::==>>", event['pathParameters'])
    logger.info(f'Incoming request is: {event}')
    response = {
        'statusCode': 500,
        'body': 'An error occured while getting post.'
    }
    print(":::::==>>", event)

    post_id = event['pathParameters']['postId']

    post_query = dynamodb.get_item(
        TableName=table_name, Key={'id': {'S': post_id}})
    
    if 'Item' in post_query:
        post = post_query['Item']
        logger.info(f'Post is: {post}')
        response = {
            'statusCode': 
        }