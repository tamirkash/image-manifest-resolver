const core = require('@actions/core');
const github = require('@actions/github');
const { ECRClient, BatchGetImageCommand } = require('@aws-sdk/client-ecr');

try {
  let digest;
  const architecture = core.getInput('architecture');
  const awsRegion = core.getInput('aws-region');
  const repositoryName = core.getInput('repository-name');
  const imageTag = core.getInput('image-tag');

  console.log(`Resolving image for architecture: ${architecture}!`);
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
  console.log("command: ", command);

  client.send(command).then(response => {
    console.log("response: ", response);
    if (!response.mediaType || !response.mediaType.includes("manifest")) {
        throw {
          message: "could not find any manifest list"
        };
      }

      response.manifests.array.forEach(element => {
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
