const core = require('@actions/core');
const github = require('@actions/github');
const { ECRClient, BatchGetImageCommand } = require('@aws-sdk/client-ecr');

try {
  let digest;
  const architecture = core.getInput('architecture');
  const awsRegion = core.getInput('aws-region');
  const repositoryName = core.getInput('repository-name');
  const imageTag = core.getInput('image-tag');

  console.log(`Resolving image for architecture: ${architecture}`);
  const client = new ECRClient({ region: awsRegion });
  const input = {
    imageIds: [
      {
        imageTag
      }
    ],
    repositoryName
  };
  const command = new BatchGetImageCommand(input);

  client.send(command).then(response => {
      if (!response.images || !response.images[0] || !response.images[0].imageManifest) {
          throw {
            message: "could not find any manifest list"
          };
      }

      const manifests = JSON.parse(response.images[0].imageManifest).manifests;

      manifests.forEach(element => {
        if (element.platform.architecture === architecture) {
          digest = element.digest;
        }
      });

      if (!digest) {
        throw {
          message: "could not find an image with the required architecture"
        };
      }
      
      core.setOutput("digest", digest);
      console.log(`Setting output.digest: ${digest}`);
  })
} catch (error) {
  core.setFailed(error.message);
}
