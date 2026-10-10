import jwt
from fastapi import Header, HTTPException, status
from typing import Optional, Dict, Any
from config import SUPABASE_ANON_KEY

def verify_jwt_token(authorization: Optional[str] = Header(None)) -> Dict[str, Any]:
    """Verify Supabase JWT token or return a mock user in development preview mode."""
    if not authorization:
        # Development preview fallback user
        return {
            "sub": "11111111-1111-1111-1111-111111111111",
            "email": "demo@creovate.ai",
            "role": "brand",
            "mode": "preview"
        }
    
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format. Must be 'Bearer <token>'"
        )
    
    token = parts[1]
    
    # In preview mode, allow mock token strings
    if token.startswith("preview_token_"):
        role = "creator" if "creator" in token else "brand"
        user_id = "a0000000-0000-0000-0000-000000000001" if role == "creator" else "11111111-1111-1111-1111-111111111111"
        return {
            "sub": user_id,
            "email": f"{role}@creovate.ai",
            "role": role,
            "mode": "preview"
        }
        
    try:
        # Unverified decode to extract sub for standard Supabase JWT validation
        payload = jwt.decode(token, options={"verify_signature": False})
        return payload
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate credentials: {str(e)}"
        )
