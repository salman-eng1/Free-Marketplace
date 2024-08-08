variable "prv3_id" {
  description = "The first private subnets"
  type        = string
}
variable "prv4_id" {
  description = "The second private subnet"
  type        = string
}
variable "marketplace-postgres-sg" {
  description = "postgres sgw"
  type        = string
}
variable "marketplace-redis-sg" {
  description = "redis sgw"
  type        = string
}
variable "marketplace-mysql-sg" {
  description = "mysql sgw"
  type        = string
}


resource "aws_db_subnet_group" "subGP" {
  name       = "marktplace-rds-subnet-group"
  subnet_ids = [var.prv3_id, var.prv4_id]
  description="RDS subnet group for RDS and Postgres"
  tags = {
    Name = "marktplace-rds-subnet-group"
  }
}

resource "aws_db_instance" "postgres" {
  allocated_storage    = 10
  db_name              = "market_reviews"
  engine               = "postgres"
  engine_version       = "16.3"
  instance_class       = "db.t3.micro"
  username             = "jobber"
  password             = "api@dev@ops"
  parameter_group_name = "default.postgres16"
  storage_encrypted = false
  skip_final_snapshot  = true

  # Endpoint and connectivity settings
  db_subnet_group_name = "marktplace-rds-subnet-group"          # Replace with your DB subnet group name
  vpc_security_group_ids = [var.marketplace-postgres-sg]          # Replace with your VPC security group ID(s)

  tags = {
    Name        = "MyReviewService_Free tier"
    Environment = "Production"
  }
}
