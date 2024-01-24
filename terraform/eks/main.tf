provider "aws" {
  region = var.region
  shared_credentials_files = ["~/.aws/credentials"]
}

module "vpc" {
  source = "../module/vpc"

  region = var.region
  environment = var.environment
  app_name = var.app_name

  vpc_cidr = var.vpc_cidr
  public_subnet_az1_cidr = var.public_subnet_az1_cidr
  public_subnet_az2_cidr = var.public_subnet_az2_cidr
  private_subnet_az1_cidr = var.private_subnet_az1_cidr
  private_subnet_az2_cidr = var.private_subnet_az2_cidr
  private_subnet_tags = {
    "kubernetes.io/role/internal-elb" = 1
  }
  public_subnet_tags = {
    "kubernetes.io/role/elb" = 1
  }
}

module "nat_gateway" {
  source = "../module/nat-gateway"

  environment = var.environment
  app_name = var.app_name
  vpc_id = module.vpc.vpc_id
  public_subnet_az1_id = module.vpc.public_subnet_az1_id
  public_subnet_az2_id = module.vpc.public_subnet_az2_id
  private_subnet_az1_id = module.vpc.private_subnet_az1_id
  private_subnet_az2_id = module.vpc.private_subnet_az2_id
  internet_gateway = module.vpc.internet_gateway
}

resource "aws_iam_role" "eks_cluster_role" {
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "eks.amazonaws.com"
        }
      },
    ]
  })

  managed_policy_arns = ["arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"]
  tags = {
    Name = "${var.app_name}-${var.environment}-eks-cluster-role"
  }
}

resource "aws_iam_role_policy_attachment" "eks_cluster_AmazonEKSClusterPolicy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  role = aws_iam_role.eks_cluster_role.name
}

resource "aws_eks_cluster" "eks_cluster" {
  name = "${var.app_name}-${var.environment}-eks-cluster"
  role_arn = aws_iam_role.eks_cluster_role.arn
  version = "19.21.0"

  vpc_config {
    subnet_ids = [
      module.vpc.private_subnet_az1_id,
      module.vpc.private_subnet_az2_id,
      module.vpc.public_subnet_az1_id,
      module.vpc.public_subnet_az2_id
    ]
  }

  tags = {
    Name = "${var.app_name}-${var.environment}-eks-cluster"
  }

  depends_on = [ aws_iam_role_policy_attachment.eks_cluster_AmazonEKSClusterPolicy ]
}

resource "aws_eks_addon" "esk_addon_vpc-cni" {
  cluster_name = aws_eks_cluster.eks_cluster.name
  addon_name   = "vpc-cni"
  addon_version = data.aws_eks_addon_version.vpc-cni_latest.version
}
resource "aws_eks_addon" "esk_addon_kube-proxy" {
  cluster_name = aws_eks_cluster.eks_cluster.name
  addon_name   = "kube-proxy"
  addon_version = data.aws_eks_addon_version.kube-proxy_latest.version
}
resource "aws_eks_addon" "esk_addon_coredns" {
  cluster_name = aws_eks_cluster.eks_cluster.name
  addon_name   = "coredns"
  addon_version = data.aws_eks_addon_version.coredns_lastest.version
}

data "aws_eks_addon_version" "vpc-cni_latest" {
  addon_name         = "vpc-cni"
  kubernetes_version = aws_eks_cluster.eks_cluster.version
  most_recent        = true
}

data "aws_eks_addon_version" "kube-proxy_latest" {
  addon_name         = "kube-proxy"
  kubernetes_version = aws_eks_cluster.eks_cluster.version
  most_recent        = true
}

data "aws_eks_addon_version" "coredns_lastest" {
  addon_name         = "coredns"
  kubernetes_version = aws_eks_cluster.eks_cluster.version
  most_recent        = true
}

resource "aws_iam_role" "eks_node_role" {
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      },
    ]
  })

  managed_policy_arns = [
    "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly",
    "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy",
    "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
  ]
  
  tags = {
    Name = "${var.app_name}-${var.environment}-eks-node-role"
  }
}

resource "aws_iam_role_policy_attachment" "eks_node_AmazonEC2ContainerRegistryReadOnly" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
  role = aws_iam_role.eks_node_role.name
}

resource "aws_iam_role_policy_attachment" "eks_node_AmazonEKS_CNI_Policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
  role = aws_iam_role.eks_node_role.name
}

resource "aws_iam_role_policy_attachment" "eks_node_AmazonEKSWorkerNodePolicy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
  role = aws_iam_role.eks_node_role.name
}

resource "aws_eks_node_group" "eks_private_node_group" {
  cluster_name = aws_eks_cluster.eks_cluster.name
  node_group_name = "${var.app_name}-${var.environment}-eks-node-group"
  node_role_arn = aws_iam_role.eks_node_role.arn

  subnet_ids = [
    module.vpc.private_subnet_az1_id,
    module.vpc.private_subnet_az2_id,
    module.vpc.public_subnet_az1_id,
    module.vpc.public_subnet_az2_id
  ]

  capacity_type = "ON_DEMAND"
  instance_types = ["t3.small"]

  scaling_config {
    desired_size = 2
    max_size = 2
    min_size = 2
  }

  update_config {
    max_unavailable = 1
  }

  tags = {
    Name = "${var.app_name}-${var.environment}-eks-node-group"
  }

  depends_on = [ 
    aws_iam_role_policy_attachment.eks_node_AmazonEC2ContainerRegistryReadOnly,
    aws_iam_role_policy_attachment.eks_node_AmazonEKS_CNI_Policy,
    aws_iam_role_policy_attachment.eks_node_AmazonEKSWorkerNodePolicy
  ]
}