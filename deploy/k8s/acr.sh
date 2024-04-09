#!/bin/bash

AKS_RESOURCE_GROUP=FlashCastEvaluation
AKS_CLUSTER_NAME=FlashCastK8s
ACR_RESOURCE_GROUP=FlashCastEvaluation
ACR_NAME=flashcasteval

# Get the id of the service principal configured for AKS
CLIENT_ID=$(az aks show --resource-group $AKS_RESOURCE_GROUP --name $AKS_CLUSTER_NAME --query "servicePrincipalProfile.clientId" --output tsv)
az aks show --resource-group FlashCastEvaluation --name FlashCastK8s  --query "identityProfile.kubeletidentity.clientId"
 # Get the ACR registry resource id
ACR_ID=$(az acr show --name flashcasteval --resource-group FlashCastEvaluation --query "id" --output tsv)
az acr show --name flashcasteval --resource-group FlashCastEvaluation --query "id" --output tsv
# Create role assignment
az role assignment create --assignee "e7c40a71-239c-465c-acee-24d2b555e63e" --role AcrPull --scope "/subscriptions/062c3243-3c1a-4647-a71f-35ce706bf8b2/resourceGroups/FlashCastEvaluation/providers/Microsoft.ContainerRegistry/registries/flashcasteval"
