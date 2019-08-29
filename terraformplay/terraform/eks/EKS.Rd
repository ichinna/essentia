How to create EKS cluster with?

eksctl create cluster --name hulk-snp0 --region us-west-2 --version 1.13 --vpc-cidr 10.0.0.0/6 --vpc-private-subnets subnet-0be89bb05ae99b086,subnet-0b505729afe0127a6 --kubeconfig /Users/chinnababusadam/.kube/coobz/hulk_snp

This will perfrom the following steps

(a) Creates an EKS cluster and control plane
(b) Defaultly creates two EC2 instances (2 nodes as per EKS terminology)

Note:
    1. Defaults to two nodes, use --node <integer> to create as many as you wish
    2. If the given subnets are public, there will be no extra overhead to expose them, otherwise there will be some conflicts between
    3. Make sure you VPC enabled with `DNS resolution` and `DNS hostnames`





Deploying Kubernetes into EKS:

Well, first you need a helm deployment template.

Follow the steps bellow to authrize the docker in EKS while helm is deploying the service.  Helps with `imagePullSecrets` in .yaml spec
    Ref: https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/




Fianlly deploy your service using helm upgrade or install...