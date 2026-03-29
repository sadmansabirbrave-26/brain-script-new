#!/bin/bash

echo "Deploying Firestore security rules..."

# Deploy Firestore rules
firebase deploy --only firestore:rules

echo "Firestore rules deployed successfully!"
