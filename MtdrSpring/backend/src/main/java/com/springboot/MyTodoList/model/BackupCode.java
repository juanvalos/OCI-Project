package com.springboot.MyTodoList.model;

import javax.persistence.*;

@Entity
@Table(name = "BACKUP_CODES", schema = "TODOUSER")
public class BackupCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // matches column ORACLE_USERID
    @Column(name = "ORACLE_USERID", nullable = false)
    private Long userId;

    @Column(name = "CODE_HASH", nullable = false, length = 100)
    private String codeHash;

    @Column(name = "USED", nullable = false)
    private Boolean used = false;

    public BackupCode() {}

    // convenience ctor
    public BackupCode(Long userId, String codeHash) {
        this.userId = userId;
        this.codeHash = codeHash;
        this.used = false;
    }

    // getters & setters
    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getCodeHash() { return codeHash; }
    public void setCodeHash(String codeHash) { this.codeHash = codeHash; }
    public Boolean getUsed() { return used; }
    public void setUsed(Boolean used) { this.used = used; }
}
