resource "aws_s3_bucket" "sparticle-engine-prod-audio" {
  bucket = "sparticle-engine-prod-audio"
  acl    = "public-read"
}

resource "aws_dynamodb_table" "sparticle-articles" {
  name = "articles"
  hash_key = "sessionId"
  range_key = "created"
  read_capacity = 5
  write_capacity = 5

  attribute {
    name = "sessionId"
    type = "S"
  }

  attribute {
    name = "created"
    type = "N"
  }

  global_secondary_index {
    hash_key = "id"
    name = "idIndex"
    projection_type = "ALL"
    read_capacity = 5
    write_capacity = 5
  }

  attribute {
    name = "id"
    type = "S"
  }

  global_secondary_index {
    hash_key = "encodedUrl"
    name = "encodedUrlIndex"
    projection_type = "ALL"
    read_capacity = 5
    write_capacity = 5
  }

  attribute {
    name = "encodedUrl"
    type = "S"
  }

  global_secondary_index {
    hash_key = "pollyTaskId"
    name = "pollyTaskIdIndex"
    projection_type = "ALL"
    read_capacity = 5
    write_capacity = 5
  }

  attribute {
    name = "pollyTaskId"
    type = "S"
  }
}

resource "aws_ssm_parameter" "sparticle-jwt-secret-key" {
  name  = "jwt-secret-key"
  type  = "SecureString"
  value = var.jwt-secret-key
}

resource "aws_sns_topic" "sparticle-polly-task-updates" {
  name = "sparticle-polly-task-updates"
}