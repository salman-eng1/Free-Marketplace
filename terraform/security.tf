
resource "aws_security_group" "bastion_sg" {
  name        = "bastion_sg"
  description = "Allow access for bastion instance"
  vpc_id      = aws_vpc.marketplace_vpc.id

}

resource "aws_security_group_rule" "ssh_inbound" {
  type              = "ingress"
  from_port         = 22
  to_port           = 22
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]  //restrict to ip address or ip range
  security_group_id = aws_security_group.bastion_sg.id
}



# resource "aws_security_group" "marketplace-mysql-sg" {
#   name        = "marketplace-mysql-sg"
#   description = "Allow access for RDS database on port 3305"
#   vpc_id      = var.vpc_id

#   ingress {
#     from_port   = 3306
#     to_port     = 3306
#     protocol    = "tcp"
#     cidr_blocks = ["0.0.0.0/0"]  # Allowing from anywhere
#   }

#   egress {
#     from_port   = 0
#     to_port     = 0
#     protocol    = "-1"  # Allow all outbound traffic
#     cidr_blocks = ["0.0.0.0/0"]
#   }

#   tags = {
#     Name = "marketplace-mysql-sg"
#   }
# }
