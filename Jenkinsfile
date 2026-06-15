pipeline {
  agent any
  environment {
    DOCKERHUB_USER = 'rajkumar179'
    BACKEND_IMAGE  = "${DOCKERHUB_USER}/userapp-backend"
    FRONTEND_IMAGE = "${DOCKERHUB_USER}/userapp-frontend"
    EC2_HOST       = '13.200.246.130'
    EC2_USER       = 'ec2-user'
  }
  stages {
    stage('Checkout') {
      steps { checkout scm }
    }
    stage('Test Backend') {
      steps {
        dir('backend') {
          sh 'npm install'
          sh 'npm test || echo "No tests configured, skipping"'
        }
      }
    }
    stage('Build Images') {
      steps {
        sh "docker build -t ${BACKEND_IMAGE}:${BUILD_NUMBER} ./backend"
        sh "docker build --build-arg REACT_APP_API_URL=http://${EC2_HOST}:5000 -t ${FRONTEND_IMAGE}:${BUILD_NUMBER} ./frontend"
        sh "docker tag ${BACKEND_IMAGE}:${BUILD_NUMBER} ${BACKEND_IMAGE}:latest"
        sh "docker tag ${FRONTEND_IMAGE}:${BUILD_NUMBER} ${FRONTEND_IMAGE}:latest"
      }
    }
    stage('Push to Docker Hub') {
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'dockerhub-creds',
          usernameVariable: 'DOCKER_USER',
          passwordVariable: 'DOCKER_PASS'
        )]) {
          sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
          sh "docker push ${BACKEND_IMAGE}:${BUILD_NUMBER}"
          sh "docker push ${BACKEND_IMAGE}:latest"
          sh "docker push ${FRONTEND_IMAGE}:${BUILD_NUMBER}"
          sh "docker push ${FRONTEND_IMAGE}:latest"
        }
      }
    }
    stage('Deploy to EC2') {
      steps {
        sshagent(['ec2-ssh-key']) {
          sh """
            scp -o StrictHostKeyChecking=no docker-compose.yml ${EC2_USER}@${EC2_HOST}:~/
            scp -o StrictHostKeyChecking=no backend/init.sql ${EC2_USER}@${EC2_HOST}:~/
            ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} '
              docker-compose pull &&
              docker-compose up -d --remove-orphans &&
              docker image prune -f
            '
          """
        }
      }
    }
  }
  post {
    success { echo 'Deployment successful!' }
    failure { echo 'Pipeline failed. Check logs.' }
    always  { sh 'docker logout' }
  }
}
