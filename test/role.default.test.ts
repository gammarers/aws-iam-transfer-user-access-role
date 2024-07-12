import { App, Stack } from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { IamTransferUserAccessRole } from '../src';

describe('IamTransferUserAccessRole default Testing', () => {

  const app = new App();
  const stack = new Stack(app, 'TestingStack', {
    env: {
      account: '123456789012',
      region: 'us-east-1',
    },
  });

  const bucket = new s3.Bucket(stack, 'TestBicket');

  const role = new IamTransferUserAccessRole(stack, 'IamTransferUserAccessRole', {
    bucket,
  });

  it('Is IAM Role', async () => {
    expect(role).toBeInstanceOf(iam.Role);
  });

  const template = Template.fromStack(stack);

  it('Should match iam role.', async () => {
    template.hasResourceProperties('AWS::IAM::Role', Match.objectEquals({
      Description: 'sftp user access role',
      AssumeRolePolicyDocument: Match.objectEquals({
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: 'transfer.amazonaws.com',
            },
          },
        ],
      }),
      Policies: Match.arrayEquals([
        Match.objectEquals({
          PolicyName: 'allow-bucket-access-policy',
          PolicyDocument: Match.objectEquals({
            Version: '2012-10-17',
            Statement: Match.arrayEquals([
              Match.objectEquals({
                Sid: 'AllowListingOfUserFolder',
                Effect: 'Allow',
                Action: [
                  's3:ListBucket',
                  's3:GetBucketLocation',
                ],
                Resource: {
                  'Fn::GetAtt': [
                    Match.stringLikeRegexp('TestBicket'),
                    'Arn',
                  ],
                },
              }),
              Match.objectEquals({
                Sid: 'HomeDirObjectAccess',
                Effect: 'Allow',
                Action: [
                  's3:PutObject',
                  's3:PutObjectACL',
                  's3:GetObject',
                  's3:GetObjectACL',
                  's3:GetObjectVersion',
                  's3:DeleteObject',
                  's3:DeleteObjectVersion',
                ],
                Resource: {
                  'Fn::Join': [
                    '',
                    [
                      {
                        'Fn::GetAtt': [
                          Match.stringLikeRegexp('TestBicket'),
                          'Arn',
                        ],
                      },
                      '/*',
                    ],
                  ],
                },
              }),
            ]),
          }),
        }),
      ]),
    }));
  });

  it('Should match snapshot.', async () => {
    expect(template.toJSON()).toMatchSnapshot();
  });

});