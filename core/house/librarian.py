"""
    Librarian keeps track of your data. Data is stored in blob
    storage. Storage consist of containers, containers have file
    system structure and data location can be described as follow:
    <storage account>
        <container>
            <uuid>.json
    There two containers:
        - train-data, for training
        - test-data, for testing
"""

import uuid
import enum
import json
import logging
from azure.identity import DefaultAzureCredential
from azure.storage.blob import BlobServiceClient
from core.settings import STORAGE_ACCOUNT
from core.exceptions import DataException, OperationException


class Containers(enum.Enum):
    TRAIN = "train-data"
    TEST = "test-data"


class Librarian:
    def __init__(self):
        token_credential = DefaultAzureCredential()
        self.blob_service_client = BlobServiceClient(
            account_url=f"https://{STORAGE_ACCOUNT}.blob.core.windows.net",
            credential=token_credential,
        )

    def put_record(self, data, container: Containers):
        try:
            data_str = json.dumps(data)
        except Exception as e:
            logging.exception(e)
            raise DataException("Data is not JSON serializable") from e

        try:
            container_client = self.blob_service_client.get_container_client(
                container=container.value
            )
            blob_name = f"{uuid.uuid1()}.json"
            blob_client = container_client.get_blob_client(blob_name)
            blob_client.upload_blob(data=data_str)
        except Exception as e:
            logging.exception(e)
            raise OperationException("Failed to upload data") from e

        return blob_name

    def get_record(self, blob_name: str, container: Containers):
        try:
            container_client = self.blob_service_client.get_container_client(
                container=container.value
            )
            blob_client = container_client.get_blob_client(blob_name)
            data_str = blob_client.download_blob().content_as_text()
        except Exception as e:
            logging.exception(e)
            raise OperationException("Failed to download data") from e

        try:
            data = json.loads(data_str)
        except:
            raise DataException("Data is not JSON")

        return data


if __name__ == "__main__":
    librarian = Librarian()
    # print(librarian.put_record({"a": 123}, Containers.TEST))
    print(
        librarian.get_record(
            "9aaf64d6-a6b5-11ef-a820-9115302b05bd.json", Containers.TEST
        )
    )
