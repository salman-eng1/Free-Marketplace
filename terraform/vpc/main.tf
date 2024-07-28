# Define the VPC
resource "aws_vpc" "marketplace_vpc" {
  cidr_block = "10.0.0.0/16"
enable_dns_hostnames=true
  tags = {
    Name = "marketplace_cluster_vpc"
  }

}

#resource "aws_internet_gateway" "marketplace_igw" {
#  vpc_id = aws_vpc.marketplace_vpc.id
#
#  tags = {
#    Name = "marketplace_igw"
#  }
#}

resource "aws_eip" "eip" {
  vpc = true
}

output "vpc_id" {
  value = aws_vpc.marketplace_vpc.id
}
#output "igw_id" {
#  value = aws_internet_gateway.marketplace_igw.id
#}
output "eip_id" {
  value = aws_eip.eip.id
}
