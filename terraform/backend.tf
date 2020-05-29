terraform {
  backend "s3" {
    key            = "curvytron/terraform.tfstate"
    region         = "eu-west-1"
  }
}