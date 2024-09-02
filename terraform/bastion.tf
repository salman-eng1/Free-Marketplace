data "aws_ami" "ubuntu"{
  most_recent      = true

    filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-20240801"]
  }

    filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
owners = ["099720109477"]

}

data "aws_key_pair" "existing_key_pair" {
  key_name           = "marketplace"
  include_public_key = true

}

resource "aws_instance" "bastion" {
  ami           = data.aws_ami.ubuntu.id
  key_name = data.aws_key_pair.existing_key_pair.key_name
  instance_type = var.instance_type
  associate_public_ip_address = true
  subnet_id = aws_subnet.marketplace_pub1.id
  vpc_security_group_ids = [aws_security_group.bastion_sg.id]

  tags = {
    Name = "bastion_instance"
  }
}