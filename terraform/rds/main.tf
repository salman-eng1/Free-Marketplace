variable "prv3_id" {
  description = "The first private subnets"
  type        = string
}
variable "prv4_id" {
  description = "The second private subnet"
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
