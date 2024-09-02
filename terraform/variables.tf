variable "vpc_cidr" {
  default = "10.0.0.0/16"
}

variable "az1" {
  default = "us-east-1a"
}

variable "az2" {
  default = "us-east-1b"
}

variable "instance_type" {
  default = "t3.micro"
}