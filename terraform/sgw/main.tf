variable "vpc_id" {
  description = "The IGW ID to associate with the VPC"
  type        = string
}

resource "aws_security_group" "marketplace-mysql-sg" {
  name        = "marketplace-mysql-sg"
  description = "Allow access for RDS database on port 3305"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Allowing from anywhere
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"  # Allow all outbound traffic
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "marketplace-mysql-sg"
  }
}




resource "aws_security_group" "marketplace-postgres-sg" {
  name        = "marketplace-postgres-sg"
  description = "Allow access for RDS database on port 5432"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Allowing from anywhere
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"  # Allow all outbound traffic
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "marketplace-postgres-sg"
  }
}

resource "aws_security_group" "marketplace-redis-sg" {
  name        = "marketplace-redis-sg"
  description = "Allow access to redis cluster"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 6379
    to_port     = 6379
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Allowing from anywhere
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"  # Allow all outbound traffic
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "marketplace-redis-sg"
  }
}

output "marketplace-redis-sg" {
  value = aws_security_group.marketplace-redis-sg.id
}

