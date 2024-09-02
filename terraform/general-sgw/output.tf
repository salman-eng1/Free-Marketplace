output marketplace-mysql-sg{
    value="${aws_security_group.marketplace-mysql-sg.id}"
}
output marketplace-postgres-sg{
    value="${aws_security_group.marketplace-postgres-sg.id}"
}
output marketplace-redis-sg{
    value="${aws_security_group.marketplace-redis-sg.id}"
}