#!/bin/bash

echo "Checking Prisma schema for Document model casing..."
grep -n "model Document" prisma/schema.prisma

echo "Verifying if all lowercase version exists..."
grep -n "model document" prisma/schema.prisma

echo ""
echo "Analyzing schema models:"
grep -n "model " prisma/schema.prisma

# Provide a suggested fix
echo ""
echo "Suggested action:"
echo "Run this command to regenerate your Prisma client and restart your server"
echo ""
echo "npx prisma generate && npm run dev"
