variable "vpc_id" {
  description = "The VPC ID to associate with the subnets"
  type        = string
}
variable "igw_id" {
  description = "The IGW ID to associate with the VPC"
  type        = string
}
variable "ngw_id" {
  description = "The NAT GW ID to associate with the private subnets"
  type        = string
}

resource "aws_subnet" "marketplace_pub1" {
  vpc_id = var.vpc_id
  cidr_block = "10.0.0.0/24"
  availability_zone="us-east-1a"

  tags = {
    Name = "marketplace-public-subnet-1"
  }

}

resource "aws_subnet" "marketplace_pub2" {
  vpc_id = var.vpc_id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "us-east-1b"

  tags = {
    Name = "marketplace-public-subnet-2"
  }
}

resource "aws_subnet" "marketplace_prv3" {
  vpc_id = var.vpc_id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "us-east-1a"

  tags = {
    Name = "marketplace-private-subnet-3"
  }
}

resource "aws_subnet" "marketplace_prv4" {
  vpc_id = var.vpc_id
  cidr_block        = "10.0.3.0/24"
  availability_zone = "us-east-1b"

  tags = {
    Name = "marketplace-private-subnet-4"
  }
}



resource "aws_route_table" "marketplace_pubrt" {
  vpc_id = var.vpc_id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = var.igw_id
  }

  tags = {
    Name = "marketplace-public-rt"
  }
}

resource "aws_route_table" "marketplace_prvrt" {
  vpc_id = var.vpc_id
  route {
    cidr_block = "0.0.0.0/0"
    nat_gateway_id = var.ngw_id
  }

  tags = {
    Name = "marketplace-private-rt"
  }
}

resource "aws_route_table_association" "public1" {
  subnet_id      = aws_subnet.marketplace_pub1.id
  route_table_id = aws_route_table.marketplace_pubrt.id
}
resource "aws_route_table_association" "public2" {
  subnet_id      = aws_subnet.marketplace_pub2.id
  route_table_id = aws_route_table.marketplace_pubrt.id
}
resource "aws_route_table_association" "private3" {
  subnet_id      = aws_subnet.marketplace_prv3.id
  route_table_id = aws_route_table.marketplace_prvrt.id
}
resource "aws_route_table_association" "private4" {
  subnet_id      = aws_subnet.marketplace_prv4.id
  route_table_id = aws_route_table.marketplace_prvrt.id
}

output "pub1_id" {
  value = aws_subnet.marketplace_pub1.id
}
output "pub2_id" {
  value = aws_subnet.marketplace_pub2.id
}
output "prv3_id" {
  value = aws_subnet.marketplace_prv3.id
}
output "prv4_id" {
  value = aws_subnet.marketplace_prv4.id
}
