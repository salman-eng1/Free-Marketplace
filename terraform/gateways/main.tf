variable "vpc_id" {
  description = "The IGW ID to associate with the VPC"
  type        = string
}
variable "eip_id" {
  description = "The IGW ID to associate with the VPC"
  type        = string
}
variable "pub1_id" {
  description = "The first public subnets"
  type        = string
}
variable "pub2_id" {
  description = "The second public subnet"
  type        = string
}

resource "aws_internet_gateway" "marketplace_igw" {
  vpc_id = var.vpc_id

  tags = {
    Name = "marketplace_igw"
  }
}
resource "aws_nat_gateway" "marketplace_ngw" {
  allocation_id = var.eip_id
  subnet_id=var.pub1_id
  tags = {
    Name = "marketplace NAT gateway"
  }
}

output "igw_id" {
  value = aws_internet_gateway.marketplace_igw.id
}

output "ngw_id" {
  value = aws_nat_gateway.marketplace_ngw.id
}
