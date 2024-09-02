resource "aws_vpc" "marketplace_vpc" {
  cidr_block = var.vpc_cidr
  tags = {
    Name = "marketplace_cluster_vpc"
  }

}

resource "aws_subnet" "marketplace_pub1" {
  vpc_id = aws_vpc.marketplace_vpc.id
  cidr_block = "10.0.1.0/24"
  availability_zone=var.az1
  map_public_ip_on_launch=true
  tags = {
    Name = "marketplace-public-subnet-1"
  }

}

resource "aws_subnet" "marketplace_pub2" {
  vpc_id = aws_vpc.marketplace_vpc.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = var.az2
  map_public_ip_on_launch=true

  tags = {
    Name = "marketplace-public-subnet-2"
  }
}


resource "aws_subnet" "marketplace_prv3" {
  vpc_id = aws_vpc.marketplace_vpc.id
  cidr_block        = "10.0.3.0/24"
  availability_zone = var.az1
  tags = {
    Name = "marketplace-private-subnet-3"
  }
}

resource "aws_subnet" "marketplace_prv4" {
  vpc_id = aws_vpc.marketplace_vpc.id
  cidr_block        = "10.0.4.0/24"
  availability_zone = var.az2
  tags = {
    Name = "marketplace-private-subnet-4"
  }
}


resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.marketplace_vpc.id
  tags = {
    Name = "marketplace_igw"
  }
}


resource "aws_eip" "eip" {
  domain = "vpc"
}

resource "aws_nat_gateway" "marketplace_ngw" {
  allocation_id = aws_eip.eip.id
  subnet_id=aws_subnet.marketplace_pub1.id
  tags = {
    Name = "marketplace NAT gateway"
  }
}

resource "aws_route_table" "marketplace_pubrt" {
  vpc_id = aws_vpc.marketplace_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name = "marketplace-public-rt"
  }
}

resource "aws_route_table" "marketplace_prvrt" {
  vpc_id = aws_vpc.marketplace_vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.marketplace_ngw.id
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

module "sgs" {
  source = "./eks-sg"
  vpc_id = aws_vpc.marketplace_vpc.id
}
module "sgw" {
  source = "./general-sgw"
  vpc_id = aws_vpc.marketplace_vpc.id
}
module "eks" {
  source = "./eks"
  vpc_id = aws_vpc.marketplace_vpc.id
  subnet_ids=[aws_subnet.marketplace_prv3.id,aws_subnet.marketplace_prv4.id]
  sg_ids=module.sgs.security_group_public
}
module "rds" {
  source                  = "./rds-files"
  prv3_id                 = aws_subnet.marketplace_prv3.id
  prv4_id                 = aws_subnet.marketplace_prv4.id
  marketplace-postgres-sg = module.sgw.marketplace-postgres-sg
  marketplace-mysql-sg    = module.sgw.marketplace-mysql-sg
  marketplace-redis-sg    = module.sgw.marketplace-redis-sg
}

module "elasticache" {
  source               = "./elasticache"
  prv3_id                 = aws_subnet.marketplace_prv3.id
  prv4_id                 = aws_subnet.marketplace_prv4.id
  marketplace-redis-sg = module.sgw.marketplace-redis-sg
}