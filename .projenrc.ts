import { awscdk, javascript } from 'projen';
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'yicr',
  authorAddress: 'yicr@users.noreply.github.com',
  authorOrganization: true,
  cdkVersion: '2.189.1',
  defaultReleaseBranch: 'main',
  typescriptVersion: '5.7.x',
  jsiiVersion: '5.7.x',
  name: '@gammarers/aws-iam-transfer-user-access-role',
  projenrcTs: true,
  repositoryUrl: 'https://github.com/gammarers/aws-iam-transfer-user-access-role.git',
  majorVersion: 1,
  deps: [
    '@gammarers/aws-cdk-errors@~0.2.0',
  ],
  npmAccess: javascript.NpmAccess.PUBLIC,
  depsUpgrade: true,
  depsUpgradeOptions: {
    workflowOptions: {
      labels: ['auto-approve', 'auto-merge'],
      schedule: javascript.UpgradeDependenciesSchedule.expressions(['15 17 8 * *']),
    },
  },
  minNodeVersion: '18.0.0',
  workflowNodeVersion: '22.x',
  autoApproveOptions: {
    secret: 'GITHUB_TOKEN',
    allowedUsernames: ['yicr'],
  },
});
project.synth();