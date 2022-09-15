# image-manifest-resolver
This action resolves a docker image digest according to the desired architecture, using a manifest file that is fetched from AWS ECR.

## Inputs

## `architecture`

**Required** The desired architecture for the docker image

## `aws-region`

**Required** AWS region

## `image-tag`

**Required** The image tag of the manifest file

## `repository-name`

**Required** The ECR repository name

## Environment Variables

## `AWS_ACCESS_KEY_ID`

**Required** AWS access key ID

## `AWS_SECRET_ACCESS_KEY`

**Required** AWS secret access key

## Outputs

## `digest`

The desired docker image digest

## Example usage

uses: tamirkash/image-manifest-resolver@v1.0.3
with:
  architecture: amd64
  aws-region: eu-west-1
  image-tag: latest_release
  repository-name: my-repository