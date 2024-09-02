variable "prv3_id" {
  description = "The first private subnets"
  type        = string
}
variable "prv4_id" {
  description = "The second private subnet"
  type        = string
}
variable "marketplace-postgres-sg" {
  description = "postgres sgw"
  type        = string
}
variable "marketplace-redis-sg" {
  description = "redis sgw"
  type        = string
}
variable "marketplace-mysql-sg" {
  description = "mysql sgw"
  type        = string
}