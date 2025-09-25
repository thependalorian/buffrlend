#!/bin/bash

# BuffrLend Deployment Script
# This script helps deploy the application to different environments

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check environment variables
check_env_vars() {
    print_status "Checking environment variables..."
    
    local required_vars=(
        "NEXT_PUBLIC_SUPABASE_URL"
        "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    )
    
    local missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -ne 0 ]; then
        print_error "Missing required environment variables:"
        for var in "${missing_vars[@]}"; do
            echo "  - $var"
        done
        print_error "Please set these variables before deploying."
        exit 1
    fi
    
    print_success "Environment variables check passed"
}

# Function to run tests
run_tests() {
    print_status "Running tests..."
    
    if command_exists npm; then
        npm test
        print_success "Tests passed"
    else
        print_warning "npm not found, skipping tests"
    fi
}

# Function to build the application
build_app() {
    print_status "Building application..."
    
    if command_exists npm; then
        npm run build
        print_success "Build completed"
    else
        print_error "npm not found, cannot build application"
        exit 1
    fi
}

# Function to deploy to Vercel
deploy_vercel() {
    print_status "Deploying to Vercel..."
    
    if command_exists vercel; then
        vercel --prod
        print_success "Deployed to Vercel"
    else
        print_error "Vercel CLI not found. Install it with: npm i -g vercel"
        exit 1
    fi
}

# Function to build Docker image
build_docker() {
    print_status "Building Docker image..."
    
    if command_exists docker; then
        docker build -t buffrlend-app .
        print_success "Docker image built successfully"
    else
        print_error "Docker not found, cannot build image"
        exit 1
    fi
}

# Function to run Docker container
run_docker() {
    print_status "Running Docker container..."
    
    if command_exists docker; then
        docker run -d \
            --name buffrlend-app \
            -p 3000:3000 \
            --env-file .env.local \
            buffrlend-app
        print_success "Docker container started"
    else
        print_error "Docker not found, cannot run container"
        exit 1
    fi
}

# Function to deploy with Docker Compose
deploy_docker_compose() {
    print_status "Deploying with Docker Compose..."
    
    if command_exists docker-compose; then
        docker-compose up -d
        print_success "Docker Compose deployment completed"
    else
        print_error "Docker Compose not found, cannot deploy"
        exit 1
    fi
}

# Function to show help
show_help() {
    echo "BuffrLend Deployment Script"
    echo ""
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  test              Run tests"
    echo "  build             Build the application"
    echo "  vercel            Deploy to Vercel"
    echo "  docker            Build Docker image"
    echo "  docker-run        Run Docker container"
    echo "  docker-compose    Deploy with Docker Compose"
    echo "  full              Full deployment (test, build, deploy)"
    echo "  help              Show this help message"
    echo ""
    echo "Environment Variables:"
    echo "  Make sure to set the required environment variables in .env.local"
    echo "  See env.template for the complete list of variables"
}

# Main script logic
case "${1:-help}" in
    "test")
        check_env_vars
        run_tests
        ;;
    "build")
        check_env_vars
        build_app
        ;;
    "vercel")
        check_env_vars
        run_tests
        deploy_vercel
        ;;
    "docker")
        check_env_vars
        build_docker
        ;;
    "docker-run")
        check_env_vars
        build_docker
        run_docker
        ;;
    "docker-compose")
        check_env_vars
        deploy_docker_compose
        ;;
    "full")
        check_env_vars
        run_tests
        build_app
        print_status "Choose deployment method:"
        echo "1. Vercel"
        echo "2. Docker"
        echo "3. Docker Compose"
        read -p "Enter choice (1-3): " choice
        case $choice in
            1) deploy_vercel ;;
            2) build_docker && run_docker ;;
            3) deploy_docker_compose ;;
            *) print_error "Invalid choice" && exit 1 ;;
        esac
        ;;
    "help"|*)
        show_help
        ;;
esac

print_success "Deployment script completed"
