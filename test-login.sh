#!/bin/bash

echo "=== 测试登录流程 ==="
echo ""

echo "1. 登录获取Token..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}')

echo "$LOGIN_RESPONSE" | jq '.'

TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.accessToken')

if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
  echo "❌ 登录失败"
  exit 1
fi

echo ""
echo "✅ 登录成功！Token: ${TOKEN:0:50}..."
echo ""

echo "2. 获取用户信息..."
USER_INFO=$(curl -s -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer $TOKEN")

echo "$USER_INFO" | jq '.'

if echo "$USER_INFO" | jq -e '.code == "0000"' > /dev/null; then
  echo ""
  echo "✅ 获取用户信息成功！"
else
  echo ""
  echo "❌ 获取用户信息失败"
  exit 1
fi

echo ""
echo "3. 获取学生列表..."
STUDENTS=$(curl -s -X GET "http://localhost:3001/api/students?current=1&size=10" \
  -H "Authorization: Bearer $TOKEN")

echo "$STUDENTS" | jq '.'

if echo "$STUDENTS" | jq -e '.code == "0000"' > /dev/null; then
  echo ""
  echo "✅ 获取学生列表成功！"
else
  echo ""
  echo "❌ 获取学生列表失败"
  exit 1
fi

echo ""
echo "4. 获取教师列表..."
TEACHERS=$(curl -s -X GET "http://localhost:3001/api/teachers?current=1&size=10" \
  -H "Authorization: Bearer $TOKEN")

echo "$TEACHERS" | jq '.'

if echo "$TEACHERS" | jq -e '.code == "0000"' > /dev/null; then
  echo ""
  echo "✅ 获取教师列表成功！"
else
  echo ""
  echo "❌ 获取教师列表失败"
  exit 1
fi

echo ""
echo "========================================="
echo "🎉 所有测试通过！"
echo "========================================="
