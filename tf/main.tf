resource "aws_s3_bucket" "sparticle-engine-prod-audio" {
  bucket = "sparticle-engine-prod-audio"
  acl    = "public-read"
}

resource "aws_dynamodb_table" "sparticle-articles" {
  name = "articles"
  hash_key = "id"
  read_capacity = 5
  write_capacity = 5

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "sessionId"
    type = "S"
  }

  attribute {
    name = "encodedUrl"
    type = "S"
  }

  global_secondary_index {
    hash_key = "sessionId"
    name = "sessionIdIndex"
    non_key_attributes = []
    projection_type = "ALL"
    read_capacity = 5
    write_capacity = 5
  }

  global_secondary_index {
    hash_key = "encodedUrl"
    name = "encodedUrlIndex"
    non_key_attributes = []
    projection_type = "ALL"
    read_capacity = 5
    write_capacity = 5
  }
}

resource "aws_ssm_parameter" "sparticle-jwt-secret-key" {
  name  = "jwt-secret-key"
  type  = "SecureString"
  value = var.jwt-secret-key
}
