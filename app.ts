#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { NhlPlayoffPathStack } from './infrastructure/stack';
import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

const app = new cdk.App();

// Build the React frontend before synthesis if dist doesn't exist
const frontendDir = path.join(__dirname, 'frontend');
const distDir = path.join(frontendDir, 'dist');

if (!fs.existsSync(distDir)) {
  console.log('Building React frontend...');
  execSync('npm install', { cwd: frontendDir, stdio: 'inherit' });
  execSync('npm run build', { cwd: frontendDir, stdio: 'inherit' });
}

new NhlPlayoffPathStack(app, 'NhlPlayoffPathStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'us-east-1',
  },
});
