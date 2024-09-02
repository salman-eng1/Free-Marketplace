provider "aws" {
  region = "us-east-1"
}

terraform {
  backend "s3" {
    bucket = "remote-backend-marketplace"
    key= "global/s3/terraform.tfstate"
    region= "us-east-1"
    dynamodb_table = "dynamodb-locking-table"
    encrypt = true
  }
}