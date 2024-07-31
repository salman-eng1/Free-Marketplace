provider "aws" {
  region = "us-east-1"
}

module "vpc" {
  source = "./vpc"
}

module "subnets" {
  source = "./subnets"

  vpc_id = module.vpc.vpc_id
  ngw_id = module.gateways.ngw_id
  igw_id = module.gateways.igw_id
}

module "gateways" {
  source = "./gateways"
  vpc_id = module.vpc.vpc_id
  eip_id = module.vpc.eip_id
pub1_id=module.subnets.pub1_id
pub2_id=module.subnets.pub2_id
}
module "sgw" {
  source = "./sgw"
  vpc_id = module.vpc.vpc_id
}

module "rds" {
  source = "./rds"
prv3_id=module.subnets.prv3_id
prv4_id=module.subnets.prv4_id

}
module "elasticache" {
  source = "./elasticache"
prv3_id=module.subnets.prv3_id
prv4_id=module.subnets.prv4_id
marketplace-redis-sg=module.sgw.marketplace-redis-sg
}
