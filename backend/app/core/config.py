from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    zenodo_client_id: str = ""
    zenodo_client_secret: str = ""
    zenodo_base_url: str = "https://sandbox.zenodo.org"
    community_id: str = "nfdi-matwerk"
    secret_key: str = "changeme"
    frontend_url: str = "http://localhost:3000"

    # Must match EXACTLY what you registered in the Zenodo OAuth app
    oauth_redirect_uri: str = "http://localhost:8000/auth/callback"

    # Derived Zenodo endpoints
    @property
    def zenodo_authorize_url(self) -> str:
        return f"{self.zenodo_base_url}/oauth/authorize"

    @property
    def zenodo_token_url(self) -> str:
        return f"{self.zenodo_base_url}/oauth/token"

    @property
    def zenodo_api_url(self) -> str:
        return f"{self.zenodo_base_url}/api"

    class Config:
        env_file = ".env"


settings = Settings()
