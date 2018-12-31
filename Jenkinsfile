#!/usr/bin/env groovy

@Library('jenkins')
import net.intellihr.Helper
import net.intellihr.CodeAnalysis

def helper = new net.intellihr.Helper(this)
def analyse = new net.intellihr.CodeAnalysis(this)

def (ignorePublishChoice, patchChoice, minorChoice, majorChoice) = ['Do not release', 'Patch', 'Minor', 'Major']

pipeline {
  agent any

  parameters {
    choice(
      name: 'RELEASE_VERSION',
      choices: "$ignorePublishChoice\n$patchChoice\n$minorChoice\n$majorChoice",
      description: 'Which release version to publish?'
    )
  }

  environment {
    COMPOSE_PROJECT_NAME = "$BUILD_TAG"
  }

  stages {
    stage('Build') {
      steps {
        sh 'docker-compose build --force-rm jenkins'
      }
    }

    stage('Test') {
      parallel {
        stage('Lint') {
          agent any

          steps {
            sh '''
              docker-compose run \
                --rm \
                jenkins \
                npm run lint
            '''
          }
        }

        stage('Unit Test') {
          agent any

          steps {
            sh '''
              docker-compose run \
                --rm \
                jenkins \
                npm run test
            '''
          }
        }
      }
    }

    stage('Publish') {
      when {
        expression {
          env.BRANCH_NAME == 'master' && params.RELEASE_VERSION != ignorePublishChoice
        }
      }
      steps {
        sshagent (credentials: ['GITHUB_CI_SSH_KEY']) {
          script {
            env.NPM_TOKEN = helper.getSSMParameter('shared.NPM_TOKEN')
            env.RELEASE_VERSION = params.RELEASE_VERSION.toLowerCase()
          }

          sh '''
              docker-compose run \
                --rm \
                --volume "$SSH_AUTH_SOCK":/tmp/agent.sock \
                -e SSH_AUTH_SOCK=/tmp/agent.sock \
                -e NPM_TOKEN=$NPM_TOKEN \
                -e RELEASE_VERSION=$RELEASE_VERSION \
                jenkins \
                ./.docker/scripts/deploy-npm
          '''
        }
      }
    }
  }

  post {
    always {
      sh 'docker-compose down || true'
      sh 'docker-compose rm -f -s -v || true'
    }
    failure {
      slackSend(
        channel: "#devops-log",
        color: 'danger',
        message: "Jenkins recorder-js (${env.BRANCH_NAME}) <${env.BUILD_URL}|#${env.BUILD_NUMBER}> *FAILED*"
      )
    }
    success {
      slackSend(
        channel: "#devops-log",
        color: 'good',
        message: "Jenkins recorder-js (${env.BRANCH_NAME}) <${env.BUILD_URL}|#${env.BUILD_NUMBER}> *SUCCESSFUL*"
      )
    }
  }
}
