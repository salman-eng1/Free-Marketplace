resource "aws_s3_bucket" "remote-statefiles-bucket" {
  bucket = var.bucket-name
  # force_destroy=true
}

resource "aws_s3_bucket_versioning" "bucket-versioning" {
  bucket = var.bucket-name
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "bucket_encrypt" {
  bucket = var.bucket-name

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "AES256"
    }
  }
}


resource "aws_dynamodb_table" "terraform_locks" {
  name           = var.dynamodb-table
  billing_mode   = "PROVISIONED"
  read_capacity  = 20
  write_capacity = 20
  hash_key       = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }
  }