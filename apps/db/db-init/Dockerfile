FROM mongo:7.0.2

# Copy the script into the container
COPY init-replica.sh /init-replica.sh

# Ensure the script is executable (optional if you've already set permissions before copying)
RUN chmod +x /init-replica.sh

# Set the script as the entry point
ENTRYPOINT ["/init-replica.sh"]
