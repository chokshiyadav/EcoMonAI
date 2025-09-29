pipeline {
    agent any
    environment {
        MONGO_URL = "mongodb+srv://charan03:030904@clusterecoverse.xxoya0d.mongodb.net/ecoverse"
        JWT_SECRET = "SDNCN23423TN394UFKND"
        jwt_token = "dhfmharnca394020"
        KUBECONFIG = '/var/lib/jenkins/.kube/config'
    }
    stages {
        stage('Stage 1: Git Clone') {
            steps {
                git branch: 'main',
                url: 'https://github.com/charansrisai03/bookmyevent.git'
            }
        }
        stage('client build') {
            steps {
                dir('client'){
                sh 'docker build -t charansrisai/frontend:latest .'
            }
            }
        }
        stage("Server build") {
            steps {
                dir('backend'){
                sh 'docker build -t charansrisai/backend:latest .'
            }}
        }
        stage('Push to Docker Hub') {
            steps {
                script {
                        sh "docker login --username charansrisai --password Amma@0309"
                        sh 'docker push charansrisai/frontend:latest'
                        sh "docker push charansrisai/backend:latest"
                    
                }
            }
        }
        stage('Ansible Deployment') {
            steps {
                script { 
                    sh 'ansible-playbook playbook-k8.yml -i inventory-k8'
                }
            }
        }
    }
}
