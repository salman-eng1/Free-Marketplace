namespace = "production"
serviceName = "marketplace-review"
service = "Marketplace Reviews"

def groovyMethods
m1 = System.currentTimeMillis()

pipeline {
  agent {
    label 'Jenkins-Agent'
  }

  tools {
    nodejs "NodeJS"
    dockerTool "Docker"
  }

  environment {
    DOCKER_CREDENTIALS = credentials("dockerhub")
    IMAGE_NAME = "eng9/marketplace-review"
    IMAGE_TAG = "stable-${BUILD_NUMBER}"
  }

  stages { 
    stage("Cleanup Workspace") {
      steps {
        cleanWs()
      }
    }
    stage("Prepare Environment") {
      steps {
        script {
          // Inject GitHub credentials into the environment
          withCredentials([usernamePassword(credentialsId: 'github', usernameVariable: 'GITHUB_USERNAME', passwordVariable: 'GITHUB_TOKEN')]) {
            sh "[ -d pipeline ] || mkdir pipeline"
            dir("pipeline") {
              // Add your jenkins automation url to url field
              git branch: 'main', credentialsId: 'github', url: 'https://github.com/salman-eng1/jenkins-automation.git'
              script {
                groovyMethods = load("functions.groovy")
              }
            }
            // Checkout the Git repository
            git branch: 'master', credentialsId: 'github', url: 'https://github.com/salman-eng1/marketplace-review.git'
            // Replace the contents of the existing .npmrc file
            sh '''
              echo "Creating .npmrc file..."
              echo "//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}" > .npmrc
              echo "@salman-eng1:registry=https://npm.pkg.github.com/salman-eng1" >> .npmrc
              echo "File content:"
              cat .npmrc
            '''
            // Install npm dependencies
            sh 'npm install'
            sh 'cat .npmrc'
            sh 'rm .npmrc'
          }
        }
      }
    }
    
    stage("Lint Check") {
      steps {
        sh 'npm run lint:check'
      }
    }

    stage("Code Format Check") {
      steps {
        sh 'npm run prettier:check'
      }
    }
    
    stage("Unit Test") {
      steps {
        sh 'npm run test'
      }
    }

    stage("Build and Push") {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKERHUB_USERNAME', passwordVariable: 'DOCKERHUB_PASSWORD')]) {
          sh 'docker login -u $DOCKERHUB_USERNAME --password $DOCKERHUB_PASSWORD'
          sh "docker build -t $IMAGE_NAME ."
          sh "docker tag $IMAGE_NAME $IMAGE_NAME:$IMAGE_TAG"
          sh "docker tag $IMAGE_NAME $IMAGE_NAME:stable"
          sh "docker push $IMAGE_NAME:$IMAGE_TAG"
          sh "docker push $IMAGE_NAME:stable"
        }
      }
    }

    stage("Clean Artifacts") {
      steps {
        sh "docker rmi $IMAGE_NAME:$IMAGE_TAG"
        sh "docker rmi $IMAGE_NAME:stable"
      }
    }


    stage("Create New Pods") {
      steps {
withKubeCredentials(kubectlCredentials: [[caCertificate: '', clusterName: 'minikube', contextName: 'minikube', credentialsId: ' jenkins-k8s-token', namespace: '', serverUrl: 'https://192.168.39.212:8443']]) {
             script {
            def pods = groovyMethods.findPodsFromName("${namespace}", "${serviceName}")
            for (podName in pods) {
              sh """
                kubectl delete -n ${namespace} pod ${podName}
                sleep 10s
              """
            }
          }
        }
      }
    }
  
  }
    post {
    success {
      script {
        m2 = System.currentTimeMillis()
        def durTime = groovyMethods.durationTime(m1, m2)
        def author = groovyMethods.readCommitAuthor()
        groovyMethods.notifySlack("", "marketplace-jenkins", [
        				[
        					title: "BUILD SUCCEEDED: ${service} Service with build number ${env.BUILD_NUMBER}",
        					title_link: "${env.BUILD_URL}",
        					color: "good",
        					text: "Created by: ${author}",
        					"mrkdwn_in": ["fields"],
        					fields: [
        						[
        							title: "Duration Time",
        							value: "${durTime}",
        							short: true
        						],
        						[
        							title: "Stage Name",
        							value: "Production",
        							short: true
        						],
        					]
        				]
        		]
        )
      }
    }
    failure {
      script {
        m2 = System.currentTimeMillis()
        def durTime = groovyMethods.durationTime(m1, m2)
        def author = groovyMethods.readCommitAuthor()
        groovyMethods.notifySlack("", "marketplace-jenkins", [
        				[
        					title: "BUILD FAILED: ${service} Service with build number ${env.BUILD_NUMBER}",
        					title_link: "${env.BUILD_URL}",
        					color: "error",
        					text: "Created by: ${author}",
        					"mrkdwn_in": ["fields"],
        					fields: [
        						[
        							title: "Duration Time",
        							value: "${durTime}",
        							short: true
        						],
        						[
        							title: "Stage Name",
        							value: "Production",
        							short: true
        						],
        					]
        				]
        		]
        )
      }
    }
  }
}}
