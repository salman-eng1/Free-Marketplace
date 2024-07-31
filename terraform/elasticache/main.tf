
resource "aws_elasticache_subnet_group" "elasticache-subnet-group" {
  name       = "marketplace-elasticache-subnet-group"
  subnet_ids = [var.prv3_id,var.prv4_id]
}


resource "aws_elasticache_replication_group" "redis-replica-group" {
  automatic_failover_enabled  = true
  multi_az_enabled            = true
  auto_minor_version_upgrade  = false
  replication_group_id        = "tf-rep-group-1"
  description                 = "redis cluster"
  node_type                   = "cache.t3.small"
  num_cache_clusters          = 2
  parameter_group_name        = "default.redis7"
  port                        = 6379
  engine_version               = "7.1"
  security_group_ids          = [var.marketplace-redis-sg]
  subnet_group_name           = aws_elasticache_subnet_group.elasticache-subnet-group.name
}

resource "aws_elasticache_cluster" "redis-cluster" {
  cluster_id           = "elasticache-redis-cluster"
  replication_group_id = aws_elasticache_replication_group.redis-replica-group.id
}
