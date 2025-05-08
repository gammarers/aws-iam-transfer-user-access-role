import { Duration } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';


/**
 * @TODO: Not yet supported Omit
 * https://github.com/aws/jsii/issues/4468
 * type omitKeys = 'eventPattern';
 * export interface IamRDSMonitoringRoleProps extends Omit<iam.RoleProps, 'eventPattern'> {}
 */

interface IamOptionalRoleProps {
  readonly roleName?: string;
  readonly managedPolicies?: iam.IManagedPolicy[];
  readonly permissionsBoundary?: iam.IManagedPolicy;
  readonly maxSessionDuration?: Duration;
  readonly additionalInlinePolicies?: {
    [name: string]: iam.PolicyDocument;
  };
  readonly path?: string;
  readonly description?: string;
}

export interface IamTransferUserAccessRoleProps extends IamOptionalRoleProps {
  readonly bucket: s3.IBucket;
  readonly allowDir?: string;
}

export class IamTransferUserAccessRole extends iam.Role {
  constructor(scope: Construct, id: string, props: IamTransferUserAccessRoleProps) {

    super(scope, id, {
      roleName: props.roleName,
      managedPolicies: props.managedPolicies,
      permissionsBoundary: props.permissionsBoundary,
      maxSessionDuration: props.maxSessionDuration,
      path: props.path,
      description: (() => {
        return props.description ?? 'sftp user access role';
      })(),
      assumedBy: new iam.ServicePrincipal('transfer.amazonaws.com'),
      inlinePolicies: ((): { [name: string]: iam.PolicyDocument } => {
        const policies = {
          ['allow-bucket-access-policy']: new iam.PolicyDocument({
            statements: [
              new iam.PolicyStatement({
                sid: 'AllowListingOfUserFolder',
                effect: iam.Effect.ALLOW,
                actions: [
                  's3:ListBucket',
                  's3:GetBucketLocation',
                ],
                resources: [
                  props.bucket.bucketArn,
                ],
              }),
              new iam.PolicyStatement({
                sid: 'HomeDirObjectAccess',
                effect: iam.Effect.ALLOW,
                actions: [
                  's3:PutObject',
                  's3:PutObjectACL',
                  's3:GetObject',
                  's3:GetObjectACL',
                  's3:GetObjectVersion',
                  's3:DeleteObject',
                  's3:DeleteObjectVersion',
                ],
                resources: [
                  (() => {
                    if (props.allowDir) {
                      if (props.allowDir.charAt(props.allowDir.length - 1) === '/') {
                        // TODO: error when dir last char
                      }
                      if (props.allowDir.charAt(0) === '/') {
                        // TODO: error when dir first char
                      }
                      return props.bucket.bucketArn + '/' + props.allowDir + '/*';
                    }
                    return props.bucket.bucketArn + '/*';
                  })(),
                ],
              }),
            ],
          }),
        };
        return { ...policies, ...(props.additionalInlinePolicies || {}) };
      })(),
    });
  }
}
