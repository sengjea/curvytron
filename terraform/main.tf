data "aws_vpc" "default" {
  default = true
}

data "aws_subnet_ids" "public" {
  vpc_id = data.aws_vpc.default.id
}

data "aws_iam_role" "ecs_task_execution_role" {
  name = "ecsTaskExecutionRole"
}

resource "aws_security_group" "allow_curvytron" {
  name        = "allow_curvytron"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    security_groups = [ aws_security_group.allow_curvytron_lb.id ]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "allow_curvytron_lb" {
  name        = "allow_curvytron_lb"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_ecr_repository" "curvytron" {
  name = "curvytron"
}

resource "aws_ecs_cluster" "curvytron" {
  name = "curvytron"
}

resource "aws_ecs_service" "curvytron" {
  name            = "curvytron"
  cluster         = aws_ecs_cluster.curvytron.id
  task_definition = aws_ecs_task_definition.curvytron.arn
  launch_type     = "FARGATE"
  network_configuration {
    security_groups = [ aws_security_group.allow_curvytron.id ]
    subnets = data.aws_subnet_ids.public.ids
    assign_public_ip = true
  }
  desired_count   = 1

  load_balancer {
    target_group_arn = aws_lb_target_group.curvytron.arn
    container_name   = "curvytron"
    container_port   = 8080
  }
}

resource "aws_ecs_task_definition" "curvytron" {
  family = "curvytron"
  requires_compatibilities = ["FARGATE"]
  cpu       = 2048
  memory        = 4096
  network_mode      = "awsvpc"
  execution_role_arn = data.aws_iam_role.ecs_task_execution_role.arn
  container_definitions = <<DEFINITION
[
  {
    "image": "${aws_ecr_repository.curvytron.repository_url}",
    "name": "curvytron",
    "portMappings" : [{
      "containerPort": 8080
    }]
  }
]
DEFINITION
}
resource "aws_lb_target_group" "curvytron" {
  port        = 8080
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = data.aws_vpc.default.id
  health_check {
    path = "/healthcheck"
  }
}

resource "aws_lb" "curvytron" {
  load_balancer_type = "application"
  security_groups    = [ aws_security_group.allow_curvytron_lb.id ]
  subnets            = data.aws_subnet_ids.public.ids
}

resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.curvytron.arn
  port              = var.acm_certificate_arn != null ? 443 : 80
  protocol          = var.acm_certificate_arn != null ? "HTTPS" : "HTTP"
  ssl_policy        = var.acm_certificate_arn != null ? "ELBSecurityPolicy-2016-08" : null
  certificate_arn   = var.acm_certificate_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.curvytron.arn
  }
}