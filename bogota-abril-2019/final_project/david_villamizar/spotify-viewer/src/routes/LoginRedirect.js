import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { addCredentials } from "../store/actions";

export function login() {
  // https://developer.spotify.com/dashboard/login
  const clientId = "37073364f98646ebb1f587b1a5747043";
  // The exact redirectUri must be registered with spotify first.
  const redirectUri = "http://localhost:3000/spotify-redirect/";
  // https://developer.spotify.com/documentation/general/guides/scopes/#user-read-recently-played
  const scopes = ["user-read-email", "user-top-read"].join(" ");
  const e = encodeURIComponent;
  window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${e(
    redirectUri,
  )}&response_type=token&scope=${e(scopes)}`;
}

function LoginRedirect(props) {
  const params = {};
  props.location.hash
    .slice(1)
    .split("&")
    .forEach(keyVal => {
      const [key, val] = keyVal
        .split("=")
        .map(token => encodeURIComponent(token));
      params[key] = val;
    });

  useEffect(() => {
    props.addCredentials(params);
  });
  if (!params.access_token) {
    return <p>There was a problem logging in to Spotify</p>;
  }
  return <Redirect to="/artists" />;
}

const mapDispatchToProps = dispatch => ({
  addCredentials: ({ access_token, expires_in, token_type }) =>
    dispatch(addCredentials({ access_token, expires_in, token_type })),
});

export default connect(
  undefined,
  mapDispatchToProps,
)(LoginRedirect);
