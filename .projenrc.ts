import { awscdk, javascript } from 'projen';
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'yicr',
  authorAddress: 'yicr@users.noreply.github.com',
  authorOrganization: true,
  cdkVersion: '2.80.0',
  defaultReleaseBranch: 'main',
  typescriptVersion: '5.4.x',
  jsiiVersion: '5.4.x',
  name: '@gammarers/aws-iam-transfer-user-access-role',
  projenrcTs: true,
  repositoryUrl: 'https://github.com/gammarers/aws-iam-transfer-user-access-role.git',
  releaseToNpm: false, // temporary
  depsUpgrade: true,
  depsUpgradeOptions: {
    workflowOptions: {
      labels: ['auto-approve', 'auto-merge'],
      schedule: javascript.UpgradeDependenciesSchedule.expressions(['0 18 * * *']), // every sunday (JST/MON:03:00)
    },
  },
});
project.synth();