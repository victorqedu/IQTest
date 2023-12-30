package com.caido.iqtest.util;

import com.caido.iqtest.config.SecurityConstants;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import io.jsonwebtoken.security.WeakKeyException;
import java.nio.charset.StandardCharsets;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.crypto.SecretKey;

public class JWT {
    public static String getClaimByNameFromToken(String token, String claimName) throws Exception {
        System.out.println("getClaimByNameFromToken for token "+token+" and claim "+claimName);
        Claims claims;
        try {
            SecretKey secret = Keys.hmacShaKeyFor(SecurityConstants.JWT_KEY.getBytes(StandardCharsets.UTF_8));
            claims = Jwts.parserBuilder().setSigningKey(secret).build().parseClaimsJws(token).getBody();
            System.out.println("getClaimByNameFromToken for token "+token+" and claim "+claimName+"  val is "+claims.get(claimName).toString());
            return claims.get(claimName).toString();
        } catch (io.jsonwebtoken.ExpiredJwtException ex) {
            throw ex;
        } catch (MalformedJwtException | UnsupportedJwtException | SignatureException | WeakKeyException | IllegalArgumentException ex) {
            Logger.getLogger(JWT.class.getName()).log(Level.SEVERE, null, ex);
            return null;
        }
    }    
}
