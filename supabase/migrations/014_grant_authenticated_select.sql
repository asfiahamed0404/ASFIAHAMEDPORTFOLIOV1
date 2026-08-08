-- Grant SELECT to the authenticated role (read‑only for any signed‑in user)
GRANT SELECT ON projects      TO authenticated;
GRANT SELECT ON skills        TO authenticated;
GRANT SELECT ON education     TO authenticated;
GRANT SELECT ON experience    TO authenticated;
GRANT SELECT ON certificates  TO authenticated;
GRANT SELECT ON site_content  TO authenticated;
GRANT SELECT ON socials       TO authenticated;
GRANT SELECT ON appreciations TO authenticated;
