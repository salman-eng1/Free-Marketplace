variable "prv3_id" {
  description = "The first private subnet"
  type        = string
}


variable "prv4_id" {
  description = "The second private subnet"
  type        = string
}

variable "marketplace-redis-sg" {
  description = "redis security group"
  type        = string
}
